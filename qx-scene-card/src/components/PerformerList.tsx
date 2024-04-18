import { IPerformer } from "../types";
import { React, libraries } from "../globals";

const PerformerLink = (
    performer: IPerformer
) => {
    const { NavLink } = libraries.ReactRouterDOM;

    return (
        <NavLink
            to={`/performers/${performer.id}`}
            className={performer.gender}
        >
            {performer.name}
        </NavLink>
    );
}

export const PerformerList = (performers?: IPerformer[]) => {
    return (
        <div className="performers">
            <div className="list">
                {performers?.map((performer) => {
                    return PerformerLink(performer);
                })}
            </div>
        </div>
    )
}