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

/*
 * Wallet payment, the four calls that place an order without ever loading
 * Shopify's checkout. The iOS kit drives Apple Pay through exactly these;
 * nothing about them is native, so a browser holding an Apple Pay token can
 * make the same sequence.
 */

/** The address Apple returns, and the shipping rate it implies. */
export const CART_DELIVERY_ADDRESS = /* GraphQL */ `
  mutation CartDeliveryAddress(
    $cartId: ID!
    $address: MailingAddressInput!
    $email: String
  ) {
    cartBuyerIdentityUpdate(
      cartId: $cartId
      buyerIdentity: {
        email: $email
        deliveryAddressPreferences: [{ deliveryAddress: $address }]
      }
    ) {
      cart {
        id
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        deliveryGroups(first: 1) {
          edges {
            node {
              id
              deliveryOptions {
                handle
                title
                estimatedCost {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_SELECT_DELIVERY = /* GraphQL */ `
  mutation CartSelectDelivery(
    $cartId: ID!
    $selected: [CartSelectedDeliveryOptionInput!]!
  ) {
    cartSelectedDeliveryOptionsUpdate(
      cartId: $cartId
      selectedDeliveryOptions: $selected
    ) {
      cart {
        id
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/** Hands Shopify the token Apple handed us. */
export const CART_PAYMENT_UPDATE = /* GraphQL */ `
  mutation CartPaymentUpdate($cartId: ID!, $payment: CartPaymentInput!) {
    cartPaymentUpdate(cartId: $cartId, payment: $payment) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Two stages, and both can refuse. Since Storefront 2025-07 the violations
 * that used to surface at submit surface here instead, so the prepare result
 * has to be read rather than assumed.
 */
export const CART_PREPARE_FOR_COMPLETION = /* GraphQL */ `
  mutation CartPrepareForCompletion($cartId: ID!) {
    cartPrepareForCompletion(cartId: $cartId) {
      result {
        __typename
        ... on CartStatusReady {
          cart {
            id
          }
        }
        ... on CartThrottled {
          pollAfter
        }
        ... on CartStatusNotReady {
          errors {
            code
            message
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_SUBMIT_FOR_COMPLETION = /* GraphQL */ `
  mutation CartSubmitForCompletion($cartId: ID!, $attemptToken: String!) {
    cartSubmitForCompletion(cartId: $cartId, attemptToken: $attemptToken) {
      result {
        __typename
        ... on SubmitSuccess {
          redirectUrl
        }
        ... on SubmitFailed {
          checkoutUrl
          errors {
            code
            message
          }
        }
        ... on SubmitThrottled {
          pollAfter
        }
        ... on SubmitAlreadyAccepted {
          attemptId
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
