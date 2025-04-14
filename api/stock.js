export default async function handler(req, res) {
    console.log("🔥 Entrou na função stock.js");
  
    // Configurar headers CORS para TODOS os pedidos
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // Lidar com o preflight CORS
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { handle } = req.body;
  
    if (!handle) {
      return res.status(400).json({ error: "Product handle is required" });
    }
  
    try {
      const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
      console.log("🔐 Token recebido:", token || "⚠️ Token não definido");
  
      const response = await fetch("https://cata-vassalo.myshopify.com/api/2023-10/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
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
          `,
        }),
      });
  
      const json = await response.json();
      console.log("📦 Resposta da Shopify:", JSON.stringify(json, null, 2));
  
      const available = json?.data?.productByHandle?.variants?.nodes?.[0]?.availableForSale;
  
      res.status(200).json({ available });
    } catch (error) {
      console.error("❌ Erro:", error);
      res.status(500).json({ error: "Erro interno ao consultar o stock" });
    }
  }
  