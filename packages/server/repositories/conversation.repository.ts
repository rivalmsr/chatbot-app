// Implementation details
const conversations = new Map<string, string>();

// Public interface
export const conversationRepository = {
  getLastConversationId(conversationId: string) {
    return conversations.get(conversationId);
  },
  setLastConversationId(conversationId: string, responseId: string) {
    return conversations.set(conversationId, responseId);
  },
};
