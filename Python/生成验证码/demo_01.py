from random import choice

#   生成随机验证码

length = 6
dictionary = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
code = ""
for i in range(length):
    code += choice(dictionary)

print(code)
