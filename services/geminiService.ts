
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWorkSummary = async (logs: string[]) => {
  if (logs.length === 0) return "Nenhum registro disponível para análise.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise os seguintes registros de construção de uma balsa na Amazônia e forneça um resumo executivo de 3 frases destacando o progresso e possíveis riscos: \n\n${logs.join('\n')}`,
      config: {
        systemInstruction: "Você é um engenheiro naval sênior especialista em construção de balsas e ferry boats."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar o resumo automático no momento.";
  }
};

export const generateProfessionalReportSummary = async (data: {
  projectTitle: string,
  totalValue: number,
  paidValue: number,
  logs: string[],
  pendingMaterials: string[],
  payrollStatus: string
}) => {
  try {
    const prompt = `Gere um Parecer Técnico Executivo para o projeto "${data.projectTitle}".
    Dados Financeiros: Valor Total R$ ${data.totalValue.toLocaleString('pt-BR')}, Valor Pago R$ ${data.paidValue.toLocaleString('pt-BR')}.
    Progresso Recente: ${data.logs.join('; ')}
    Suprimentos Pendentes: ${data.pendingMaterials.join(', ')}
    Folha de Pagamento: ${data.payrollStatus}

    O texto deve ser profissional, formal e estruturado em:
    1. Status Atual da Obra
    2. Saúde Financeira do Projeto
    3. Recomendações e Próximos Passos
    
    Limite o texto a 250 palavras.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um consultor técnico sênior da indústria naval brasileira. Seu tom é profissional, direto e focado em eficiência e segurança."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Report Analysis Error:", error);
    return "Análise técnica indisponível temporariamente.";
  }
};
