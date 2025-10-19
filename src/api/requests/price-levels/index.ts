import {
  PriceLevelSearchResults,
  PriceLevelsSearch,
  PriceLevelUpdate,
  PriceLevelVersion,
} from '../../types';
import { Request, HttpMethod } from '../../request';

/**
 * Get menus for the given restaurant.
 */
export async function searchPriceLevels(
  restaurantId: string,
  search: PriceLevelsSearch
) {
  return new Request<PriceLevelSearchResults>()
    .method(HttpMethod.POST)
    .endpoint('menus/v1/saved/price-levels/search')
    .headers({
      'Toast-Restaurant-External-Id': restaurantId,
      'Toast-Management-Set-Guid': process.env.MANAGEMENT_GROUP!,
    })
    .body(search)
    .send();
}

/**
 * Update price level.
 */
export async function updatePriceLevel(
  restaurantId: string,
  priceLevelGuid: string,
  data: PriceLevelUpdate
) {
  return new Request<PriceLevelVersion>()
    .method(HttpMethod.PATCH)
    .endpoint(`menus/v1/saved/price-levels/${priceLevelGuid}`)
    .headers({
      'Toast-Restaurant-External-Id': restaurantId,
      'Toast-Management-Set-Guid': process.env.MANAGEMENT_GROUP!,
      'Toast-User-Guid': process.env.USER_GUID!,
    })
    .body(data)
    .send();
}
