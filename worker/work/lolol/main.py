import sys
import random

actions = ["BUY", "SELL", "HOLD"]

for line in sys.stdin: 
    print(random.choice(actions), 1 + random.random() * 5)