function getDaysInMonthFromStr(dateStr) {
    // 分解字符串为年份和月份
    const [year, month] = dateStr.split('-').map(Number);
    
    // 创建一个下个月的日期，然后减去一天
    return new Date(year, month, 0).getDate();
  }

export default getDaysInMonthFromStr