package cmd

import (
	"fmt"

	"github.com/kubeshop/tracetest/cli/config"
	"github.com/spf13/cobra"
)

var versionCmd = &cobra.Command{
	Use:    "version",
	Short:  "cli versions",
	Long:   "Display this CLI tool version",
	PreRun: setupCommand,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(config.Version)
	},
	PostRun: teardownCommand,
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
