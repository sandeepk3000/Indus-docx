const percentageGenerater = (obtainedMarks: number, totalMarks: number) => {
  return Math.round((obtainedMarks / totalMarks) * 100);
};
export default percentageGenerater;
