export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { handle } = req.body;
  
    if (!handle) {
      return res.status(400).json({ error: 'Product handle is required' });
    }
  
    const query = `
      {
        productByHandle(handle: "${handle}") {
          variants(first: 1) {
            nodes {
              inventoryQuantity
            }
          }
        }
      }
    `;
  
    try {
      const response = await fetch('https://cata-vassalo.myshopify.com/api/2023-10/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '2e2424889a03df5eb3aba0fdbe02b937'
        },
        body: JSON.stringify({ query })
      });
  
      const result = await response.json();
  
      const stock = result?.data?.productByHandle?.variants?.nodes?.[0]?.inventoryQuantity ?? null;
  
      if (stock !== null) {
        return res.status(200).json({ stock });
      } else {
        return res.status(404).json({ error: 'Stock not found' });
      }
    } catch (error) {
      console.error('[API ERRO]', error);
      return res.status(500).json({ error: 'Erro ao contactar o Shopify' });
    }
  }
  