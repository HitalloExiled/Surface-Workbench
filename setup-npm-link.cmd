(cd %~dp0Surface\source\@surface\compiler & npm link) & (cd %~dp0Surface\source\@surface\cli & npm link) & (cd %~dp0App.Client & npm link @surface\compiler @surface\cli) & cd %~dp0