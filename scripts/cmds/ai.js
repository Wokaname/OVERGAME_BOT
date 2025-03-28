 const axios = require('axios');

const apiKey = "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"; // API Key Groq
const url = "https://api.groq.com/openai/v1/chat/completions"; // Groq API endpoint

async function getAIResponse(input, userName, userId, messageID) {
    try {
        const requestBody = {
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "user",
                    content: input,
                }
            ]
        };

        const response = await axios.post(url, requestBody, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        const reply = response.data.choices[0]?.message?.content || "Désolé, je n'ai pas de réponse pour le moment.";
        return { response: reply, messageID };
    } catch (error) {
        console.error("Erreur API Groq:", error);
        return { response: "Une erreur est survenue avec l'IA.", messageID };
    }
}

module.exports = {
    config: {
        name: 'ai',
        author: 'Arn',
        role: 0,
        category: 'ai',
        shortDescription: 'ai to ask anything',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) return;

        let response;
        if (input.toLowerCase() === "ai") {
            response = "𝑆𝐴𝐿𝑈𝑇 𝐽𝐸 𝑆𝑈𝐼𝑆 𝐿'𝑖𝑛𝑡𝑒𝑙𝑙𝑖𝑔𝑒𝑛𝑐𝑒 𝐴𝑅𝑇𝐼𝐹𝐼𝐸𝐿𝐿𝐸 𝐶𝑅ÉÉ 𝑃𝐴𝑅 ༒ＯＶＥＲＧＡＭＥ༒ !";
        } else {
            const aiResponse = await getAIResponse(input, event.senderID, event.messageID);
            response = aiResponse.response;
        }

        api.sendMessage(`ＯＶＥＲＧＡＭＥ' \n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, event.messageID);
    },
    onChat: async function ({ event, message }) {
        const messageContent = event.body.trim();
        if (!messageContent.toLowerCase().startsWith("ai")) return;

        let response;
        if (messageContent.toLowerCase() === "ai") {
            response = "𝑆𝐴𝐿𝑈𝑇 𝐽𝐸 𝑆𝑈𝐼𝑆 𝐿'𝑖𝑛𝑡𝑒𝑙𝑙𝑖𝑔𝑒𝑛𝑐𝑒 𝐴𝑅𝑇𝐼𝐹𝐼𝐸𝐿𝐿𝐸 𝐶𝑅ÉÉ PAR ༒ＯＶＥＲＧＡＭＥ༒ !";
        } else {
            const input = messageContent.replace(/^ai\s*/i, "").trim();
            const aiResponse = await getAIResponse(input, event.senderID, message.messageID);
            response = aiResponse.response;
        }

        message.reply(༒ＯＶＥＲＧＡＭＥ ＢＯＴ༒\n________________________________________\n${response}\n________________________`);
    }
};
