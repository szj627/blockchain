p = 11
q = 13
n = 143
z = 120
e = 7
d = 103


def jiami(m):
    c = 1
    for x in range(0, e):
        c = c * m % n
    return c


def jiemi(c):
    m = 1
    for x in range(0, d):
        m = m * c % n
    return m


f = open("input.txt")
byt = f.readlines()
for i in byt:
    exec(i.split('\t')[0])
