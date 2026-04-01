import subprocess

print("Running transaction demo")
subprocess.run(["python","transactions/transaction_demo.py"])

print("Running rollback demo")
subprocess.run(["python","transactions/rollback_demo.py"])

print("Running concurrency test")
subprocess.run(["python","transactions/concurrency_test.py"])

