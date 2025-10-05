const AI = require('../../services/ai');
const pool = require('../../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const apiKey = process.env.GEMINI_API_KEY;
const myAI = new AI(apiKey);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const fs = require('fs').promises;
const path = require('path');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.ask = async (req, res) => {
    try {
        const { userId, question, configuration } = req.body;
        const file = req.file; // from multer

        if (!userId || !question) {
            return res
                .status(400)
                .json({ message: "Please provide a question/content and the user id." });
        }

        // Parse configuration if it's a string
        const config = typeof configuration === 'string'
            ? JSON.parse(configuration)
            : configuration;

        // Replace only the prompt section in your code with this:

       const detailLevelGuidance = {
  'resumido': 'conciso com 5-8 pontos principais ou 2-3 parágrafos',
  'moderado': 'moderado com 10-15 pontos principais ou 4-6 parágrafos',
  'detalhado': 'detalhado com 15-25 pontos principais ou 7-10 parágrafos',
  'completo': 'abrangente com 25+ pontos principais ou 10+ parágrafos com detalhes extensivos'
};

const bulletInstructions = config.useBullets 
  ? 'Use bullet points (-) para listar itens de forma clara e concisa. Cada bullet point deve ter 1-2 sentenças completas.'
  : 'Escreva em parágrafos bem estruturados e fluidos. Cada parágrafo deve ter 3-5 sentenças bem desenvolvidas e cobrir uma ideia principal.';

const emojiInstruction = config.useEmojis
  ? 'Adicione emojis relevantes nos subtítulos de seção (##) para melhorar o apelo visual.'
  : 'NÃO use emojis em nenhum lugar do resumo. Nenhum emoji deve aparecer no texto.';

const titleInstruction = config.useTitleLevels
  ? 'Use # para o título principal, ## para subtítulos de seções e ### para subseções quando necessário.'
  : 'Use APENAS ## para os títulos de seção. NÃO use # (título principal) ou ### (subseções). Mantenha estrutura plana.';

const prompt = `Você é um médico altamente experiente e renomado com mais de 30 anos de experiência como médico e professor de medicina. Sua tarefa é criar um resumo médico profissional em Português Brasileiro que será copiado para o Google Docs.

CONTEÚDO PARA RESUMIR:
${question}

CONFIGURAÇÕES OBRIGATÓRIAS:
- Nível de detalhamento: ${detailLevelGuidance[config.detailLevel]}
- Formato de conteúdo: ${config.useBullets ? 'Bullet points' : 'Parágrafos'}
- Uso de emojis: ${config.useEmojis ? 'SIM - Adicionar emojis nos títulos' : 'NÃO - Sem emojis'}
- Hierarquia de títulos: ${config.useTitleLevels ? 'Completa (H1, H2, H3)' : 'Simples (apenas H2)'}

REQUISITOS DO RESUMO:

1. ESTRUTURA E FORMATAÇÃO:
   ${titleInstruction}
   ${emojiInstruction}
   ${bulletInstructions}
   Use **negrito** para destacar termos médicos importantes.

2. IDIOMA E ESTILO:
   - Escreva exclusivamente em Português Brasileiro
   - Use terminologia médica clara e profissional
   - Seja fiel ao conteúdo original
   - Mantenha um tom acadêmico mas acessível
   - Foque nos conceitos médicos mais importantes e relevância clínica

3. FORMATO DE SAÍDA OBRIGATÓRIO:
   Sua resposta DEVE ser EXATAMENTE neste formato:
   Título|Tópico|Data|ConteúdoMarkdown
   
   Componentes:
   - Título: 3-6 palavras descritivas, SEM markdown, SEM emojis
   - Tópico: Uma palavra de categoria médica (ex: Cardiologia, Neurologia, Anatomia)
   - Data: ${new Date().toLocaleDateString('pt-BR')}
   - ConteúdoMarkdown: O resumo completo formatado em markdown

4. REGRAS CRÍTICAS DE QUEBRA DE LINHA:
   - Use quebras de linha REAIS ao escrever, NÃO escreva os caracteres \\n como texto
   - Entre seções principais: deixe 2 linhas em branco (pressione enter duas vezes)
   - Entre parágrafos ou bullet points: deixe 1 linha em branco (pressione enter uma vez)
   - NUNCA escreva os caracteres barra invertida seguido de n como texto literal
   - As quebras devem ser naturais, como se estivesse escrevendo no Word

5. QUALIDADE E PRECISÃO:
   - Mantenha precisão médica em todos os termos e conceitos
   - Inclua apenas informações clinicamente relevantes
   - Evite repetições desnecessárias
   - Priorize clareza sobre complexidade
   - Organize o conteúdo de forma lógica e sequencial

Agora crie o resumo médico seguindo EXATAMENTE todas estas diretrizes.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let response;

        if (file) {
            // Create a temporary file path
            const tempFilePath = path.join('/tmp', file.originalname);

            // Write buffer to temporary file
            await fs.writeFile(tempFilePath, file.buffer);

            try {
                // Upload file using FileManager
                const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                    mimeType: file.mimetype,
                    displayName: file.originalname,
                });

                console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

                // Generate content with the uploaded file
                const result = await model.generateContent([
                    {
                        fileData: {
                            mimeType: uploadResponse.file.mimeType,
                            fileUri: uploadResponse.file.uri,
                        },
                    },
                    { text: prompt },
                ]);

                response = result.response.text();

                // Clean up temporary file
                await fs.unlink(tempFilePath);
            } catch (uploadError) {
                // Clean up temporary file even if upload fails
                await fs.unlink(tempFilePath).catch(() => { });
                throw uploadError;
            }
        } else {
            // Normal case (no file)
            const result = await model.generateContent(prompt);
            response = result.response.text();
        }

        // Save into DB
        const [chatResult] = await pool.query(
            "INSERT INTO chats(user_id) VALUES(?)",
            [userId]
        );
        const insertedChatId = chatResult.insertId;

        await pool.query(
            "INSERT INTO messages(question, response, chat_id) VALUES(?, ?, ?)",
            [question, response, insertedChatId]
        );

        return res.status(202).json({ user_id: userId, response });
    } catch (error) {
        
        console.log(`chat.controller.ask - An error occurred asking question: ${error}`);
        return res
            .status(500)
            .json({ message: `chat.controller.ask - ${error.message}` });
    }
};


/**
 * 
 * @param {*} req include in body the user id to fetch only the information related to the user logged in
 * @param {*} res response to be returned 
 * @returns list of messages for the user if the userId is provided, if not then it will error out.
 */
exports.get = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("request received on /get")
        // query to get all the information from database
        const sql = `
      select u.id as 'user_id', c.chat_id, m.message_id, c.created_at as 'chat_created_at', u.username, m.question, m.response from chats c 
        join users u on u.id = c.user_id
        join messages m on m.chat_id = c.chat_id
      where u.id = ?
      order by m.created_at desc
      limit 1;
    `;

        // store result
        const [result] = await pool.query(sql, [userId]);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ message: "chat.controller.get - Error getting users." + error });
    }
}