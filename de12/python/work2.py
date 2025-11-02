name=input("名前を教えてください")
waist=int(input("腹囲は？"))
age=int(input("年齢は？"))

print(name, "L M s サイズ判定は腹囲", waist, "cmで高さは",age, "サイズですね。")

if waist >=85:
    print(name,"は、Lサイズです")
else: waist<=85
print(name,"は、sサイズです")

name=input("名前を教えてください")
waist=float(input("腹囲は？"))
age=int(input("年齢は？"))

print(name, "L M s サイズ判定は腹囲", waist, "cmで高さは",age, "才ですね。")

if waist >=85:
    print(name,"は、Lサイズです")
else: waist<=85
print(name,"は、sサイズです")