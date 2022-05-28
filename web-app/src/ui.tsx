import { connect } from "react-redux";
import { useEffect, useState } from "react";
/* import { withRouter } from "react-router-dom"
 * */

export const useDarkMode = () => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    useEffect(() => {
        const localTheme = localStorage.getItem("theme");
        if (localTheme) {
            setTheme(localTheme);
        }
    }, []);

    return {
        theme,
        toggleTheme
    };
};
export function ComponentWithStore(Component: any) {
    return connect(
        state => {
            return { ...state };
        },
        {
            setUser: function(user: any) {
                return {
                    type: "NEW_AUTHENTICATION",
                    user
                };
            }
        }
    )(Component);
}
