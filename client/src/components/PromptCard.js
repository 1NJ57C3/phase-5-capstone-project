function PromptCard({ promptObj }){
  const { type, actor, content } = promptObj;
  
  if (type === "output") {
    return (
      <div className="game-prompt">
        <br />
        {!!actor && <div>{actor}</div>}
        <div>{content}</div>
      </div>
    )
  };

  if (type === "input") {
    return (
      <div className="game-prompt">
        <div className="display-linebreaks">&gt;&nbsp;{content}</div>
      </div>
    )
  }
};

export default PromptCard;
