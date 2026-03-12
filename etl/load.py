from app.db_connection import get_connection

def load_dataframe(df, table_name):

    conn = get_connection()
    cur = conn.cursor()

    for _, row in df.iterrows():
        columns = ",".join(row.index)
        placeholders = ",".join(["%s"] * len(row))

        query = f"""
        INSERT INTO {table_name}
        ({columns})
        VALUES ({placeholders})
        """

        cur.execute(query, tuple(row))

    conn.commit()
    cur.close()
    conn.close()

    print(f"{table_name} loaded successfully")
