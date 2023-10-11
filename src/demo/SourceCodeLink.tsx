import React from 'react';

export const SourceCodeLink = ({ href }: { href: string }) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={href}>
      Source Code on Github
    </a>
  );
};
