/*
项目中的正则
*/

// 账号 4到16位（字母，数字，下划线，减号）
export const ACC_REG =/^[a-zA-Z0-9_-]{4,16}$/

// 密码 3到12位（字母，数字，下划线，减号）
export const PASS_REG = /^[a-zA-Z0-9_-]{3,12}$/;
