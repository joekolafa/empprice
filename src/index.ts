import dotenv from 'dotenv';
import { Command } from 'commander';
import { testApi } from './test-price';
import { updateVersions, updateVersionsAll } from './update-versions';

// Configure environment variables.
dotenv.config({ quiet: true });

// Set up program commands.
const program = new Command();

// Add price levels program.
program.name('price-levels').description('Price Levels tools').version('1.0.0');

// Add update-versions command.
program
  .command('update-versions <sheetUrl>')
  .action(updateVersions)
  .description('Update price level versions from a Google Sheet URL');

// Add update-versions-all command.
program
  .command('update-versions-all <indexSheetUrl>')
  .action(updateVersionsAll)
  .description(
    'Update price level version for each sheet from an index Google Sheet URL'
  );

// Add sandbox command.
program.command('test-api').action(testApi).description('Testing sandbox');

// Parse command line arguments.
program.parse(process.argv);
