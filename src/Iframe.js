import React from 'react';

const Iframe = ({src, title, style}) => {
  return (
    <iframe
      src={src}
      title={title}
      frameBorder="0"
      style={style}
    >
    </iframe>
  );
};

export default Iframe;