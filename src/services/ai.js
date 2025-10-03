// 1. Use 'require' to import the package
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AI {
    constructor(apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async ask(question) {
        const prompt = question;

        const result = await this.model.generateContent(prompt);
        const response = result.response;
        
        const text = response.text();
        return text;
    }
}

// 2. Use 'module.exports' to export the class
module.exports = AI;