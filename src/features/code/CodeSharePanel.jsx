import Editor, {DiffEditor, useMonaco, loader} from '@monaco-editor/react';
import {useEffect, useState} from "react";
import {useDarkMode} from "@/hooks/useDarkMode.js";
import styles from './CodeEditor.module.css';
import {useCode} from "@/features/code/hooks/useCode.js";
import {PlayIcon} from "@/common/components/utils/Icons.jsx";


const CodeSharePanel = () => {
    const {darkMode} = useDarkMode();

    return (
     <>
        하하
     </>
    )
}

export default CodeSharePanel;