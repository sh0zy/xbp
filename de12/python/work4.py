for a in range(1,4):
        name=input("名前を教えてください")
        waist=float(input("腹囲は？"))
        age=int(input("年齢は？"))
print(name, "L M s サイズ判定は腹囲", waist, "cmで高さは",age, "サイズですね。")
if waist >=85:
        print(name,"は、Lサイズです")
else: waist<=85
print(name,"は、sサイズです")

print(name, "L M s サイズ判定は腹囲", waist, "cmで高さは",age, "才ですね。")

if waist >=85:
        print(name,"は、Lサイズです")
else: waist<=85
print(name,"は、sサイズです")#コロンが入っていることに注意
print(a,"人目") #タブでずらしていることに注意！

# 出力結果
# 0 人目
# 1 人目
# 2 人目
