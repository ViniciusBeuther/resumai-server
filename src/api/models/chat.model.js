class Chat{
    static async ask(){
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
  ? `
  - Use bullet points (-) para listar itens de forma clara
  - Agrupe pontos relacionados sob subtítulos apropriados
  - Cada bullet point deve ser conciso mas completo (1-2 sentenças)
  - Use sub-bullets (  - indentados com 2 espaços) quando necessário para detalhes
  `
  : `
  - Escreva em parágrafos bem estruturados e fluidos
  - Cada parágrafo deve cobrir uma ideia principal
  - Use frases de tópico claras para introduzir cada parágrafo
  - Mantenha um tom profissional e acadêmico ao longo do texto
  - Conecte os parágrafos com frases de transição
  `;

const prompt = `
Você é um médico altamente experiente e renomado com mais de 30 anos de experiência como médico e professor de medicina. Sua tarefa é criar um resumo médico profissional que será copiado para o Google Docs.

CONTEÚDO PARA RESUMIR:
${question}

REQUISITOS DO RESUMO:

1. EXTENSÃO E NÍVEL DE DETALHE:
   - Crie um resumo ${detailLevelGuidance[config.detailLevel] || config.detailLevel}
   - Foque nos conceitos médicos mais importantes e relevância clínica

2. IDIOMA E ESTILO:
   - Escreva inteiramente em Português Brasileiro
   - Use terminologia médica clara e profissional
   - Seja fiel ao conteúdo original
   - Mantenha um tom acadêmico mas acessível

3. ESTRUTURA E FORMATAÇÃO:
   - Use formatação Markdown que será convertida para o Google Docs
   - Organize o conteúdo com hierarquia clara:
     * # para o título principal (APENAS UM título principal)
     * ## para subtítulos de seções (2-5 seções recomendadas)
     * ### para subseções se necessário
   - Adicione emojis relevantes APENAS nos subtítulos de seção (##) para melhorar o apelo visual
   ${bulletInstructions}

4. ORGANIZAÇÃO DO CONTEÚDO:
   ${config.useBullets ? `
   - Inicie cada seção com um subtítulo descritivo
   - Agrupe informações relacionadas sob cada subtítulo
   - Use bullet points que sejam:
     * Pensamentos claros e completos
     * Clinicamente relevantes
     * Fáceis de escanear e entender
   - Estrutura de exemplo:
     ## 🔬 Conceitos Principais
     - Primeiro conceito importante explicado completamente
     - Segundo conceito com detalhes relevantes e contexto
     - Terceiro conceito com aplicação clínica prática
   ` : `
   - Inicie cada seção com um subtítulo descritivo
   - Escreva parágrafos fluidos que conectam ideias logicamente
   - Cada parágrafo deve ter 3-5 sentenças bem desenvolvidas
   - Use frases de transição entre parágrafos
   - Estrutura de exemplo:
     ## 🔬 Conceitos Principais
     
     Este tópico aborda os fundamentos essenciais da área médica em questão. Os conceitos apresentados são fundamentais para a compreensão clínica e aplicação prática no dia a dia médico.
     
     A relevância clínica destes conceitos se manifesta em diversos cenários práticos. Profissionais da saúde utilizam estes princípios para tomar decisões informadas e proporcionar o melhor cuidado aos pacientes.
   `}

5. FORMATO DE SAÍDA:
   Sua resposta deve ser uma única linha com separadores de pipe (|) neste formato exato:
   Título|Tópico|Data|ConteúdoMarkdown

   Onde:
   - Título: Título curto e descritivo (3-6 palavras, SEM markdown, SEM emojis)
   - Tópico: Categoria curta (ex: "Cardiologia", "Neurologia", "Anatomia")
   - Data: Data de hoje no formato DD/MM/YYYY (${new Date().toLocaleDateString('pt-BR')})
   - ConteúdoMarkdown: O resumo completo formatado com quebras de linha apropriadas

6. REGRAS DE FORMATAÇÃO MARKDOWN:
   - Use quebras de linha reais (\\n\\n entre seções, \\n para quebras simples)
   - Negrito para termos importantes: **termo importante**
   - NÃO escape as quebras de linha (use \\n real, não \\\\n)
   - Garanta espaçamento adequado entre seções para legibilidade
   - Use formatação consistente em todo o documento

7. QUALIDADE E PRECISÃO:
   - Mantenha precisão médica em todos os termos e conceitos
   - Inclua informações clinicamente relevantes
   - Evite repetições desnecessárias
   - Priorize clareza sobre complexidade
   - Destaque conceitos-chave usando **negrito**

EXEMPLO DE FORMATO DE SAÍDA:
Fisiologia Cardíaca|Cardiologia|${new Date().toLocaleDateString('pt-BR')}|# Fisiologia Cardíaca\\n\\n## 🫀 Anatomia e Estrutura\\n\\n${config.useBullets ? '- O coração é um órgão muscular composto por quatro câmaras que trabalham de forma coordenada e sincronizada\\n- O **sistema de condução elétrica** controla o ritmo cardíaco de forma precisa através de células especializadas\\n- As válvulas cardíacas garantem o fluxo unidirecional do sangue através das câmaras, prevenindo refluxo\\n- O pericárdio protege e ancora o coração na cavidade torácica\\n\\n' : 'O coração humano é um órgão muscular complexo dividido em quatro câmaras principais que funcionam de maneira integrada e coordenada. O **sistema de condução elétrica** intrínseco coordena as contrações de forma precisa e rítmica, garantindo eficiência máxima.\\n\\nAs estruturas valvares desempenham papel crucial ao garantir que o sangue flua em apenas uma direção através das câmaras. O pericárdio, membrana que envolve o coração, fornece proteção mecânica e ancoragem anatômica na cavidade torácica.\\n\\n'}## 💉 Função e Circulação\\n\\n${config.useBullets ? '- A **circulação sistêmica** distribui sangue oxigenado rico em nutrientes para todos os tecidos corporais\\n- A **circulação pulmonar** permite a oxigenação do sangue e eliminação de dióxido de carbono nos pulmões\\n- O débito cardíaco é regulado por mecanismos neurais, hormonais e locais de forma dinâmica\\n- A frequência cardíaca e o volume sistólico determinam o débito cardíaco total' : 'A circulação sanguínea divide-se em dois circuitos principais que trabalham simultaneamente e de forma complementar. O **circuito sistêmico** é responsável por distribuir sangue oxigenado e rico em nutrientes para todos os tecidos corporais, enquanto o **circuito pulmonar** realiza as trocas gasosas essenciais nos alvéolos.\\n\\nO débito cardíaco, produto da frequência cardíaca pelo volume sistólico, é finamente regulado por diversos mecanismos fisiológicos. Estes incluem controle neural autonômico, regulação hormonal e mecanismos locais de autorregulação, permitindo adaptação às demandas metabólicas variáveis do organismo.'}

Agora crie o resumo médico seguindo precisamente todas estas diretrizes. Lembre-se: a saída deve ser UMA ÚNICA LINHA com os quatro componentes separados por |.
`;

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
        await fs.unlink(tempFilePath).catch(() => {});
        throw uploadError;
      }
    } else {
      // Normal case (no file)
      const result = await model.generateContent(prompt);
      response = result.response.text();
    }

    // Save into DB
    const [chatResult] = await pool.query(
      "INSERT INTO Chats(user_id) VALUES(?)",
      [userId]
    );
    const insertedChatId = chatResult.insertId;

    await pool.query(
      "INSERT INTO Messages(question, response, chat_id) VALUES(?, ?, ?)",
      [question, response, insertedChatId]
    );

    return res.status(202).json({ user_id: userId, response });
  } catch (error) {
    console.log(`chat.controller.ask - An error occurred asking question: ${error}`);
    return res
      .status(500)
      .json({ message: `chat.controller.ask - ${error.message}` });
  }
    }
}