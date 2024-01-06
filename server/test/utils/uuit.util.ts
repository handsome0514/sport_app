export const makeNotExistsID = (id: string) => {
  return id.slice(0, id.length - 1) + (id[id.length - 1] === 'a' ? 'b' : 'a');
};
