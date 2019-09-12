import React, {FC} from 'react'

import './Page.css'

export const Page: FC = ({children}) => {
  return <div className="page">{children}</div>
}
