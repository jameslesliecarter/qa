terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region = "us-east-1"
}

resource "aws_instance" "app_server" {
  ami = "ami-0d5eff06f840b45e9"
  instance_type = "t2.micro"
  key_name = "knowledge_key"
  security_groups = [ "Central House" ]
  tags = {
    "Name" = "QA"
  }
  ebs_block_device {
    device_name = "/dev/xvda"
    volume_type = "gp2"
    volume_size = 16
  }
}