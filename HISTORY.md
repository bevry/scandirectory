# History

## v8.1.1 2024 January 3

-   Export `toList` and `toTree` for consumption in `@bevry/fs-list`
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Frontend Masters](https://FrontendMasters.com), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v8.1.0 2024 January 3

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Frontend Masters](https://FrontendMasters.com), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v8.0.0 2024 January 1

-   Rewritten nearly everything, with the modern API at the `scanDirectory` export, and a compatibility layer for the old API at the default export
-   Uses an extremely performant builtin solution, that can read 7000 files in 100ms (note that outputting the relative paths to stdout takes 150ms, and outputting it all as JSON to stdout takes 2 seconds)
-   Uses promises
    -   The compatibility layer supports the `next` callback in addition to promises
-   Returns a recursive result result map
    -   The compatibility layer provides a conversion to list and tree for the `next` callback if it detects the old format is desired
-   Actions now accept a result object instead of individual arguments
    -   The compatibility layer provides a conversion to arguments if it detects the old format is desired
-   `readFile` option is now `encoding`, as such `readFile: true` is now `encoding: "utf8"`, and `readFile: "binary"` is now `encoding: "binary"`
    -   The compatibility layer does not handle this conversion, you have to do it yourself
-   Upgraded to support [ignorefs v5](https://github.com/bevry/ignorefs/blob/master/HISTORY.md#v500-2024-january-2) which maintains compatibility while supporting so much more
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.3.0 2023 November 25

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v7.2.0 2023 November 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v7.1.0 2023 November 15

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v7.0.0 2023 November 14

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required Node.js version changed from `node: >=10` to `node: >=4` adapting to ecosystem changes

## v6.18.0 2023 November 2

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.17.0 2023 October 31

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Updated license from [`MIT`](http://spdx.org/licenses/MIT.html) to [`Artistic-2.0`](http://spdx.org/licenses/Artistic-2.0.html)

## v6.16.0 2021 July 31

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.15.0 2021 July 28

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.14.0 2020 October 29

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.13.0 2020 September 5

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.12.0 2020 August 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.11.0 2020 August 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.10.0 2020 July 23

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.9.0 2020 June 25

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.8.0 2020 June 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.7.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.6.0 2020 June 20

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.5.0 2020 June 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.4.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.3.0 2020 May 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.2.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.1.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.0.0 2020 May 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=10` to keep up with mandatory ecosystem changes

## v5.3.0 2019 December 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.2.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.1.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.0.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=0.12` to `node: >=8` to keep up with mandatory ecosystem changes

## v4.1.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.0.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=0.8` to `node: >=0.12` to keep up with mandatory ecosystem changes

## v3.0.1 2016 October 20

-   Repackaged

## v3.0.0 2016 October 20

-   Backwards compatibility breaks:
    -   Action callbacks now accept different arguments than before
-   Simplified and now powered by [readdir-cluster](https://github.com/bevry/readdir-cluster)
-   Converted from CoffeeScript to JavaScript

## v2.5.0 2014 December 17

-   Extracted from [balupton/bal-util](https://github.com/balupton/bal-util)
-   Changed accepted arguments
