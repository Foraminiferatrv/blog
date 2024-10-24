export const getImageById = (id: string) => {
  const url = process.env.NEXT_PUBLIC_API_URL + "/uploads/" + id;
  console.log(url);
  return url;
};
