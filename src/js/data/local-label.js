const altLabel = {
  ELEITO: "ELEITA"
};

module.exports = label => {
  const lbl = altLabel[label];
  return lbl ? lbl : "";
};
