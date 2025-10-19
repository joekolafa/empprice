import chalk from 'chalk';
import { getSheetJson, parseSheetId } from './util/google-sheets';
import {
  searchPriceLevels,
  updatePriceLevel,
} from './api/requests/price-levels';
import { Session } from './api/request';
import { getAuthToken } from './api/requests/auth';
import { PriceLevelVersion } from './api/types';

const INDEX_SHEET_NAME = 'Index';

const PRICING_SHEET_NAME = 'Pricing';
const MLID_SHEET_NAME = 'MLID Lookup';
const SKIP_ROWS = 8;

// Row, column of Restaurant ID and RUN group ID.
const RESTAURANT_ID_LOCATION = [4, 2],
  RUN_GROUP_LOCATION = [5, 2];

// Column of Sheet URL in index sheet.
const INDEX_SHEET_COLUMN_NAME = 0,
  INDEX_SHEET_COLUMN_URL = 3;

const PricingColumns = {
  TaxRate: 0,
  ProductName: 1,
};

const MlidColumns = {
  Product: 0,
  Modifier: 1,
  Mlid: 2,
};

type Section = {
  name?: string;
  header: string[];
  products: string[][];
};

let RESTAURANT_ID;
let RUN_GROUP_ID;
let ALL_PRICE_LEVELS: PriceLevelVersion[];

/**
 * Entry point.
 */
export async function updateVersions(sheetUrl: string) {
  Session.token = await getAuthToken();

  // Parse our sheet ID.
  const sheetId = parseSheetId(sheetUrl);

  // Get the pricing sheet and MLID sheet JSON.
  const pricingSheetJson = await getSheetJson(sheetId, PRICING_SHEET_NAME),
    mlidSheetJson = await getSheetJson(sheetId, MLID_SHEET_NAME);

  // Pull values array out of results.
  const pricingSheetValues: [] = pricingSheetJson.values,
    mlidSheetValues: [] = mlidSheetJson.values;

  RESTAURANT_ID =
    pricingSheetValues[RESTAURANT_ID_LOCATION[0]][RESTAURANT_ID_LOCATION[1]];
  RUN_GROUP_ID =
    pricingSheetValues[RUN_GROUP_LOCATION[0]][RUN_GROUP_LOCATION[1]];

  if (!RESTAURANT_ID) {
    throw Error("Couldn't find Restaurant ID");
  }
  if (!RUN_GROUP_ID) {
    throw Error("Couldn't find RUN Group ID");
  }

  // Get all price levels for this location.
  const priceLevelsSearchResponse = await searchPriceLevels(RESTAURANT_ID!, {
    targets: [{ id: RESTAURANT_ID! }],
  }).catch((error) => {
    console.error(error);
    throw error;
  });

  ALL_PRICE_LEVELS = priceLevelsSearchResponse.data;

  // Remove skipped rows
  pricingSheetValues.splice(0, SKIP_ROWS);

  // Group into sections.
  const sections = getSections(pricingSheetValues);

  for (const section of sections) {
    await processSection(section, mlidSheetValues);
  }
}

/**
 * Update all entry point.
 */
export async function updateVersionsAll(indexSheetUrl: string) {
  // Parse our sheet ID.
  const sheetId = parseSheetId(indexSheetUrl);

  // Get the index sheet JSON.
  const indexSheetJson = await getSheetJson(sheetId, INDEX_SHEET_NAME);

  // Pull values array out of results.
  const indexSheetValues: [] = indexSheetJson.values;

  for (const [index, row] of indexSheetValues.entries()) {
    if (index === 0) {
      continue;
    }

    // Get columns
    const name = row[INDEX_SHEET_COLUMN_NAME],
      sheetUrl = row[INDEX_SHEET_COLUMN_URL];

    console.log(chalk.magentaBright(`\nProcessing sheet for ${name}...\n`));

    // Run update-versions for this sheet URL.
    await updateVersions(sheetUrl);
  }
}

/**
 * Process a section.
 */
async function processSection(section: Section, mlidSheetValues: string[][]) {
  console.log(chalk.greenBright(`Processing section ${section.name}...\n`));

  const modifiers = section.header.slice(2);

  // Loop through each product in the section.
  for (const product of section.products) {
    // Get product name.
    const productName = product[PricingColumns.ProductName];

    // Prices are the remaining entries in the row.
    const prices: string[] = product.slice(2);

    // Loop through all prices.
    for (const [i, sheetPrice] of prices.entries()) {
      if (!sheetPrice || !sheetPrice.trim()) {
        continue;
      }

      // Fix price formatting.
      const price = parseFloat(sheetPrice.trim().replaceAll('$', ''))
        .toFixed(2)
        .toString();

      if (!price || price === 'NaN') {
        console.log(chalk.red(`Issue with price ${sheetPrice}`));
        continue;
      }

      // Find the MLID entry for this product and modifier combination.
      const mlidEntry = mlidSheetValues.find(
        (entry) =>
          entry[MlidColumns.Product] === productName &&
          (modifiers.length
            ? entry[MlidColumns.Modifier] === modifiers[i]
            : entry[MlidColumns.Modifier] === '')
      );

      if (!mlidEntry) {
        console.log(
          chalk.red(
            `Couldn't find MLID entry for ${productName} ${modifiers.length ? modifiers[i] : ''} ${price}.`
          )
        );
        continue;
      }

      // Find the Price Level Version entry for this MLID and run group.
      const versionEntry = ALL_PRICE_LEVELS.find(
        (level) =>
          level.multiLocationId === mlidEntry[MlidColumns.Mlid] &&
          level.target.id === RUN_GROUP_ID!
      );

      if (!versionEntry) {
        console.log(
          chalk.red(
            `Couldn't find Price Level Version entry for ${productName} ${modifiers.length ? modifiers[i] : ''} ${price}.`
          )
        );
      }

      if (price === versionEntry?.basePrice) {
        continue;
      }

      console.log(
        chalk.blue(
          `Updating Price Level Version for ${productName} ${modifiers.length ? modifiers[i] : ''} from ${versionEntry?.basePrice} to ${price}...`
        )
      );

      // Update the price for the found version.
      await updatePriceLevel(RESTAURANT_ID!, versionEntry!.versionId, {
        basePrice: price,
      });
    }
  }
}

/**
 * Get array of sections from the pricing sheet values.
 */
function getSections(pricingSheetValues: string[][]): Section[] {
  const sections: Section[] = [];

  let sectionRowIndex = 0;
  let currentSection: Section = getNewSection();
  pricingSheetValues.forEach((row: string[], i) => {
    // Empty row, add the current section to our list and start a new section.
    if (row.length === 0) {
      sections.push(currentSection);
      currentSection = getNewSection();
      sectionRowIndex = 0;
      return;
    }

    if (sectionRowIndex === 0) {
      // Section name
      currentSection.name = row[0];
    } else if (sectionRowIndex === 1) {
      // Section header
      currentSection.header = row;
    } else {
      // All other rows are products.
      currentSection.products.push(row);
    }

    // If we hit the end of the document, add the current section to our collection.
    if (i === pricingSheetValues.length - 1) {
      sections.push(currentSection);
    }

    sectionRowIndex++;
  });

  return sections;
}

/**
 * Return a new section.
 */
function getNewSection() {
  return {
    header: [],
    products: [],
  };
}
