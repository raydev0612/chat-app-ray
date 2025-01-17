import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationsPage = ({ children: any }: Props) => {
  return <ConversationFallback />;
};

export default ConversationsPage;
