export default async function handler(req, res) {
    // 🔓 Liberta o CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // 🛑 Se for uma preflight request, termina aqui
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
          "X-Shopify-Storefront-Access-Token": "59239ed451d3b995657191e32428530d"
        },
        body: JSON.stringify({
          query: `
            query {
              productByHandle(handle: "${handle}") {
                variants(first: 1) {
                  nodes {
                    inventoryQuantity
                  }
                }
              }
            }
          `
        })
      });
  
      const json = await response.json();
      const stock = json?.data?.productByHandle?.variants?.nodes?.[0]?.inventoryQuantity;
  
      res.status(200).json({ stock });
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno ao consultar o stock" });
    }
  }
  