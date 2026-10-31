/**
 * Commerce is the only thing read from Shopify: price, availability, variant
 * identity and the pre-order selling plan. Narrative, imagery and technical
 * specification live in `lib/catalog` and are merged on top.
 */
export const PRODUCT_BY_HANDLE = /* GraphQL */ `
  query ProductByHandle($handle: String!, $country: CountryCode)
  @inContext(country: $country) {
    product(handle: $handle) {
      id
      handle
      title
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      sellingPlanGroups(first: 5) {
        nodes {
          name
          sellingPlans(first: 5) {
            nodes {
              id
              name
            }
          }
        }
      }
      variants(first: 50) {
        nodes {
          id
          sku
          title
          availableForSale
          quantityAvailable
          currentlyNotInStock
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          sellingPlanAllocations(first: 5) {
            nodes {
              sellingPlan {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($input: CartInput!, $country: CountryCode)
  @inContext(country: $country) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;
