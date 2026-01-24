// `LIVE0${test?.testCodes?.length}:${test?.$id}` ye not use
// get squence in testCodes array and generate new code
//add expiry
export const codeGenerater = (testId: string, prefix: string) => {
  const time = new Date().getTime();
  const rand = Math.floor(Math.random() * 1000);
  // 1hr
  const expiry = new Date().getTime() + 60 * 60 * 1000;
  return `${prefix}${time}${rand}:${testId}:${expiry}`;
};
