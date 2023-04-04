export type HealthBarProps = {
  lifePoints: number;
};

export const HealthBar = ({ lifePoints }: HealthBarProps) => {
  return (
    <div
      className="healthBar"
      style={{
        display: "flex",
        gap: 5,
      }}
    >
      <div
        style={{
          height: 100,
          width: 100,
          borderRadius: 6,
          background: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            display: "block",
            width: "100%",
          }}
          src="images/characters/yugi.png"
          alt="kaiba"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: "bold",
          flex: 1,
          gap: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            height: "50%",
            background: "#fff",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 6,
            padding: "0 10px",
          }}
        >
          <span>LP</span>
          <span>{lifePoints}</span>
        </div>

        <div
          style={{
            display: "flex",
            height: "50%",
            background: "#fff",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 6,
            padding: "0 10px",
          }}
        >
          Yugi Muto
        </div>
      </div>
    </div>
  );
};
