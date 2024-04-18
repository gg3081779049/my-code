# 爱心函数
for y in [i * 0.1 - 1.5 for i in range(31)]:
    for x in [i * 0.1 - 1.5 for i in range(61)]:
        a = x * x + y * y - 1
        print("\u001b[31m*\u001b[0m" if a ** 3 <= x * x * y ** 3 else " ", end="")
    print()
