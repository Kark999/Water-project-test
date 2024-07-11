const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isKnownType = ['home', 'work', 'personal'].includes(contactType);
  if (isKnownType) return contactType;
};

const parseIsFavourite = (isFavourite) => {
  const isBoolean = typeof isFavourite === 'boolean';
  if (!isBoolean) return;
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
