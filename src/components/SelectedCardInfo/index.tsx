import styles from "./styles.module.scss";

export type SelectedCardInfoProps = {
  selectedCard: any;
};

export const SelectedCardInfo = ({ selectedCard }: SelectedCardInfoProps) => {
  return (
    <div className={styles.selectedCardInfo}>
      <div
        style={{
          padding: 8,
          background: "#fff",
          borderRadius: 4,
          display: "flex",
          //padding: 10,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${
            selectedCard
              ? selectedCard.image
              : "images/cards/card_face_down.jpeg"
          }`}
          alt="ded"
          style={{ width: 250 }}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: 100,
          marginTop: 20,
          background: "#fff",
          maxWidth: 290,
          borderRadius: 4,
          //padding: 10,
        }}
      >
        <span>{selectedCard?.name}</span>
      </div>
    </div>
  );
};
