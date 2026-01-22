// `LIVE0${test?.testCodes?.length}:${test?.$id}` ye not use
// get squence in testCodes array and generate new code
export const codeGenerater = (testId: string, prefix: string) => {
  const time = Date.now().toString().slice(-6);
  const rand = Math.floor(100 + Math.random() * 900);

  return `${prefix}${time}${rand}:${testId}`;
};
