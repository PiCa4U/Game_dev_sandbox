import { sendCharacterSelect } from "../net/colyseus";

const fallbackIds = ["char_1", "char_2", "char_3"];

export const CharacterSelectScreen = (): JSX.Element => (
  <div>
    <h3>Character Select</h3>
    <div className="row">
      {fallbackIds.map((id) => (
        <button key={id} onClick={() => sendCharacterSelect(id)}>Select {id}</button>
      ))}
    </div>
  </div>
);
