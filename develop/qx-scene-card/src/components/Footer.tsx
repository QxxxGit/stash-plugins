import { React, libraries } from "../globals"
import { IStudio } from "../types"

export const Footer = (date?: string, views?: number, studio?: IStudio) => {
    const { Link } = libraries.ReactRouterDOM;
    const { FormattedDate } = libraries.Intl;

    return (
        <div className="footer">
            <span className="studio">
                {studio && (
                    <Link to={`/studios/${studio.id}`}>
                        {studio.name}
                    </Link>
                )}
            </span>
            <span className="views">
                {views}{" "}
                {views === 1 && "view" || "views"}
            </span>
            <span className="date">
                {date && (
                    <FormattedDate
                        value={date}
                        format="short"
                        timeZone="utc"
                    />
                )}
            </span>
        </div>
    )
}