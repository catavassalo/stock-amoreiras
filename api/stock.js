export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { handle } = req.body;
  
    if (!handle) {
      return res.status(400).json({ error: "Product handle is required" });
    }
  
    try {
      const response = await fetch("https://cata-vassalo.myshopify.com/api/2023-10/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query {
              productByHandle(handle: "${handle}") {
                variants(first: 1) {
                  nodes {
                    availableForSale
                  }
                }
              }
            }
          `
        })
      });
  
      const json = await response.json();
      const available = json?.data?.productByHandle?.variants?.nodes?.[0]?.availableForSale;
  
      res.status(200).json({ available });
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno ao consultar o stock" });
    }
  }
  const json = await response.json();

console.log("Resposta completa da Shopify:", JSON.stringify(json, null, 2)); // <--- aqui

const available = json?.data?.productByHandle?.variants?.nodes?.[0]?.availableForSale;

res.status(200).json({ available });
