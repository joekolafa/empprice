import { it } from 'node:test';
import { Session } from './api/request';
import { getAuthToken } from './api/requests/auth';
import { getMenus } from './api/requests/menu';
import {
  searchPriceLevels,
  updatePriceLevel,
} from './api/requests/price-levels';
import { PriceLevelVersion } from './api/types';

/**
 * Entry point.
 */
export async function testApi() {
  //Session.token = await getAuthToken();
  /*
  const stores = {
    storeA: 'de3225bd-cd23-422c-839f-355d928fdfab',
    storeB: '98846e63-5532-40a5-b3c3-373fb0bc2cbc',
    storeC: 'c5aed879-f009-4779-ad33-86f760c6a946',
  };

  const searchResults = await searchPriceLevels(stores.storeA, {});

  const bacon = '1300000000693906713',
    hookAndLadder = '1300000000693896357';

  const baconVersion = searchResults.data.find(
      (result) => result.multiLocationId === bacon
    ),
    hookAndLadderVersion = searchResults.data.find(
      (result) => result.multiLocationId === hookAndLadder
    );

  if (!baconVersion || !hookAndLadderVersion) {
    throw Error("Can't find the bacon!");
  }

  updatePriceLevel(stores.storeA, baconVersion.versionId, {
    basePrice: '1.59',
  });
  updatePriceLevel(stores.storeA, hookAndLadderVersion.versionId, {
    basePrice: '11.99',
  });

  */
  // Get all versions for all stores.
  /*const allVersions: PriceLevelVersion[] = [];

  for (const storeGuid of Object.values(stores)) {
    const searchResults = await searchPriceLevels(storeGuid, {});

    searchResults.data.forEach((item) => allVersions.push(item));
  }

  console.dir(allVersions, { depth: 3 });*/
  // Get menus.
  /*const menuResponse = await getMenus('07629221-0424-483b-a3b4-bc562f8fd909');

  const menus = menuResponse.menus;

  const uniqueMenuGroupNames = new Set<string>();
  const menuGroupNames: string[] = [];
  for (const menu of menus) {
    for (const menuGroup of menu.menuGroups) {
      if (!menuGroup.name.match(/(\(P.S\))/g)) {
        uniqueMenuGroupNames.add(menuGroup.name);
        menuGroupNames.push(menuGroup.name);
      }
    }
  }

  console.log({
    uniqueMenuGroupNames: Array.from(uniqueMenuGroupNames),
    menuGroupNames: menuGroupNames,
  });*/
}
