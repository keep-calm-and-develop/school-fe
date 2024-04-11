import React, { useCallback, useState } from 'react'
import {
    Button,
    CircularProgress,
  } from '@material-ui/core'

export const LoadingButton = (props) => {
    const [loading, setLoading] = useState(false);
    const onClick = useCallback(() => {
        const res = props.onClick();
        if (res instanceof Promise) {
            setLoading(true);
            res.finally(() => setLoading(false));
        }
    }, [props]);
    return (
        <Button
            {...props}
            disabled={loading}
            onClick={onClick}
        >
            {loading && <CircularProgress size={20} />}&nbsp;{props.children}
        </Button>
    );
}