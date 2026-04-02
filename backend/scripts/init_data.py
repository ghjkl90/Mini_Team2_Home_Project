import os
import sqlite3
import pandas as pd


def main():
    con = sqlite3.connect("dataset.db")
    for entry in os.scandir("data"):
        df = pd.read_csv(entry.path)
        df.to_sql(entry.name.split(".csv")[0], con, index=False)

if __name__ == "__main__":
    main()
