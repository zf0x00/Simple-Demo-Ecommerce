import React from "react";

interface HeadingProps {
  title: string;
  description: string;
}

function Heading({ title, description }: HeadingProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default Heading;
