import { CardOffer } from "@autobattler/shared";

type Props = {
  offerId: string;
  offers: CardOffer[];
  onPick: (offerId: string, cardId: string) => void;
};

export const CardOfferRow = ({ offerId, offers, onPick }: Props): JSX.Element => (
  <div>
    {offers.map((c) => (
      <div className="card" key={c.cardId}>
        <div><strong>{c.name}</strong></div>
        <div className="muted">{c.element} / {c.rarity}</div>
        <div>{c.desc}</div>
        <button onClick={() => onPick(offerId, c.cardId)}>Buy</button>
      </div>
    ))}
  </div>
);
