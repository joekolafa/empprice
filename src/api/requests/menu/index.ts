import { MenuResponse } from '../../types';
import { Request, HttpMethod } from '../../request';

/**
 * Get menus for the given restaurant.
 */
export async function getMenus(restaurantId: string): Promise<MenuResponse> {
  return new Request<MenuResponse>()
    .method(HttpMethod.GET)
    .endpoint('menus/v2/menus')
    .headers({ 'Toast-Restaurant-External-Id': restaurantId })
    .send();
}
