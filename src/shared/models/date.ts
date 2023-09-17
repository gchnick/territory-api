export const toZeroHours = (date: Date | string) => {
  let value = new Date(date);
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const day = value.getDate();
  value = new Date(`${year}/${month}/${day} 00:00:00 GMT+0000`);
  return value;
};

export const currentDateWithoutHours = () => {
  const currentDate = new Date();
  return toZeroHours(currentDate);
};

export const increseDays = (date: Date, daysIncrese: number) => {
  const value = new Date(date);
  const dayOfMonth = value.getDate();
  value.setDate(dayOfMonth + daysIncrese);
  return value;
};
